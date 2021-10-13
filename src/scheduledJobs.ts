import { getCustomRepository, In } from "typeorm";
import { DiseaseOccurrenceRepository, PatientsRepository } from "./repositories";
import { DiseaseOccurrence, Patient } from "./models";
    
export const verifyOccurrencesExpiration = async () => {
  const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
  const patientsRepository = getCustomRepository(PatientsRepository)

  const occurrences = await diseaseOccurrenceRepository.find({
    where: {
      status: In(["Suspeito", "Infectado"])
    },
    relations: ["Disease"]
  })

  const dayInMs = 1000 * 60 * 60 * 24

  occurrences.forEach(async (occurrence) => {
    const currentDate = (new Date("2021-10-27T15:56:32.434-03:00")).getTime() //
    const occurrenceStartDate = occurrence.date_start.getTime()
    let expirationDate = occurrenceStartDate
    if(occurrence.status === "Suspeito") {
      expirationDate += occurrence.Disease.suspect_Monitoring_Days * dayInMs
    } else {
      expirationDate += occurrence.Disease.infected_Monitoring_Days * dayInMs
    }
    if(currentDate >= expirationDate) {
      const newStatus = occurrence.status === "Suspeito" ? "Saudável" : "Curado"
      try {
        await diseaseOccurrenceRepository.createQueryBuilder()
        .update(DiseaseOccurrence)
        .set({ status: newStatus, date_end: new Date() })
        .where("id = :id", { id: occurrence.id })
        .execute()

        const patientDiseaseOccurrences = await diseaseOccurrenceRepository.find({
          patient_id: occurrence.patient_id
        })

        let finalStatus = patientDiseaseOccurrences[0].status
        if(finalStatus !== "Óbito") {
          for(let occurrence of patientDiseaseOccurrences) {
            if(occurrence.status === "Óbito") {
              finalStatus = "Óbito"
              break
            }
            else if(occurrence.status === "Infectado") {
              finalStatus = "Infectado"
            }
            else if(occurrence.status === "Suspeito" && finalStatus !== "Infectado") {
              finalStatus = "Suspeito"
            }
            else if(
              (occurrence.status === "Saudável" || occurrence.status === "Curado") 
              && finalStatus !== "Infectado" && finalStatus !== "Suspeito"
            ) {
              finalStatus = "Saudável"
            }
          }
        }

        try {
          await patientsRepository.createQueryBuilder()
          .update(Patient)
          .set({ status: finalStatus })
          .where("id = :id", { id: occurrence.patient_id })
          .execute()
        } catch (error) { console.log('CronJob - Patient error: ', error) }
      } catch (error) { console.log('CronJob - Occurrence error: ', error) }
    }
  })
}
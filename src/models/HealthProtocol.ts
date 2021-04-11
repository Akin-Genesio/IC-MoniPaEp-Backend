import { Entity, PrimaryColumn } from "typeorm";


@Entity("healthProtocols")
class HealthProtocol{
    @PrimaryColumn()
    description: string

}

export { HealthProtocol };

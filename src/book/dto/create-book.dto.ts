import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateBookDto {
    @ApiProperty({ example: 'Davinchi siri' })
    @IsString()
    name: string

    @ApiProperty({ example: 123 })
    @IsNumber()
    price: number

    @ApiProperty({ example: 1 })
    @IsNumber()
    authorId: number
}

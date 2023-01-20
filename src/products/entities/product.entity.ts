import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { generateSlug } from '../../helpers/index';

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', { unique: true })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true,
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @BeforeInsert()
    createSlug() {
        const textToSlug = this.slug || this.title;

        this.slug = generateSlug(textToSlug);
    }
}

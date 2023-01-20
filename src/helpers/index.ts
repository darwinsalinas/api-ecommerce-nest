import { IsUUID, validate } from "class-validator";
import slugify from "slugify"

export const generateSlug = (text: string) => {
    return slugify(text, {
        lower: true,
        trim: true,
        strict: true
    });
}

export const isValidUUID = async (uuid: string) => {
    class IsValidUUID {
        @IsUUID()
        value: string;
    }

    let data = new IsValidUUID();
    data.value = uuid;

    const validated = await validate(data);

    return validated.length == 0;
}
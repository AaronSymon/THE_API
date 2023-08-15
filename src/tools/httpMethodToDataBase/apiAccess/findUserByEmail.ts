import {AppDataSource} from "../../../data-source.config";
import {User} from "../../../entity/user.entity";

export default async function findUserByEmail(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOne({where: {email: email}});
}
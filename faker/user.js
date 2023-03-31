import user from '../App/Users/models.js';
import { faker} from '@faker-js/faker'

const run = async (limitData) => {
    try {
        let data = [];
        for (let i = 0; i < limitData; i++) {
            data.push({
                fullname: faker.name.fullName,
                email: faker.internet.email(),
                password: faker.internet.password(),
            });
        }

        const fakerData = await user.insertMany(data);

        if (fakerData) {
            console.log(fakerData.length);
        }
    } catch (error) {
        console.log(error);
    } finally {
        process.exit();
    }
}

export { run };
import test from 'ava'
import {FixtureGenerator} from "../src";
import {faker} from "@faker-js/faker";

test('Generates faker data', async t => {
    faker.seed(1);

    const generator = new FixtureGenerator([
        {
            type: 'faker',
            key: 'faker',
            fields: {
                name: '{{name.fullName}}'
            }
        }
    ])

    const entities = await generator.all();
    t.is(entities[0].name, 'Winifred Reichel Sr.');
})
import test from 'ava'
import {FixtureGenerator} from "../src";

test('Relationship IDs are consistent', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/uuid/**.yaml', {
        variables: {
            uuid() {
                return (Math.random() + 1).toString(36).substring(7);
            }
        }
    });
    const output = await generator.all();

    t.is(output.length, 2);

    const tenant = output[0];
    t.is(tenant.__type, 'Tenant');
    const location = output[1];
    t.is(location.__type, 'Location');

    t.is(tenant.id, location.tenant.id);
});
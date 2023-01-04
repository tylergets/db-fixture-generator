import test from 'ava'
import {FixtureGenerator} from "../src";

test('Deep objects are parsed as JSON', async t => {

    const generator = new FixtureGenerator([{
        type: 'Role',
        key: 'role',
        fields: {
            permissions: {
                test: true
            }
        }
    }])

    const output =await generator.all();

    t.not(output[0].permissions, '[object Object]');
    t.is(output[0].permissions.test, true);
});
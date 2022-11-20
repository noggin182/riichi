import { testServer } from './test-server';

describe('testServer', () => {
    it('should work', () => {
        expect(testServer()).toEqual('test-server');
    });
});

const rp = require('request-promise-native');
const server = require('../server');
const { errors } = require('../constants');

const URL = 'http://localhost';
const PORT = 4584;

describe('Integration tests (execute a simple state machine)', () => {
  beforeAll(() => {
    server.start({
      port: PORT,
    });
  });

  it('should fail because no x-amz-target header', async () => {
    const options = {
      uri: `${URL}:${PORT}`,
      headers: {},
      method: 'POST',
    };
    try {
      const response = await rp(options);
      expect(response).not.toBeDefined();
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.error).toEqual(errors.server.MISSING_HEADER_TARGET);
    }
  });

  it('should fail because header malformed', async () => {
    const options = {
      uri: `${URL}:${PORT}`,
      headers: {
        'x-amz-target': 'Malformed.header',
      },
      method: 'POST',
    };
    try {
      const response = await rp(options);
      expect(response).not.toBeDefined();
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.error).toEqual(errors.server.MALFORMED_HEADER);
    }
  });

  it('should fail because invalid action', async () => {
    const options = {
      uri: `${URL}:${PORT}`,
      headers: {
        'x-amz-target': 'AWSStepFunctions.UnknownAction',
      },
      method: 'POST',
    };
    try {
      const response = await rp(options);
      expect(response).not.toBeDefined();
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.error).toEqual(errors.common.INVALID_ACTION);
    }
  });
});

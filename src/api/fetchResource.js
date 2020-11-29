const API_URL = 'https://api.openweathermap.org/data/2.5';

function ApiError(message, data, status) {
  let response;

  try {
    response = JSON.parse(data);
  } catch (e) {
    response = data;
  }

  this.response = response;
  this.message = message;
  this.status = status;
}

const fetchResource = (path, userOptions = {}) => {
  const defaultOptions = {};
  const defaultHeaders = {};

  const options = {
    ...defaultOptions,
    ...userOptions,
    headers: {
      ...defaultHeaders,
      ...userOptions.headers,
    },
  };

  const url = `${ API_URL }/${ path }`;

  const isFile = options.body instanceof File;

  if (options.body && typeof options.body === 'object' && !isFile) {
    options.body = JSON.stringify(options.body);
  }

  let response = null;

  return fetch(url, options)
    .then(responseObject => {
      response = responseObject;

      if (response.status === 401) {
        return response.text();
      }
      if (response.status < 200 || response.status >= 300) {
        return response.text();
      }
      return response.json();
    })
    .then(parsedResponse => {
      if (response.status < 200 || response.status >= 300) {
        throw parsedResponse;
      }
      return parsedResponse;
    })
    .catch(error => {
      if (response) {
        throw new ApiError(`Request failed with status ${ response.status }.`, error, response.status);
      } else {
        throw new ApiError(error.toString(), null, 'REQUEST_FAILED');
      }
    });
};

export default fetchResource;
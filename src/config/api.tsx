type ApiPropsType = {
  [key: string]: string;
};

export const spotifyEndpoint = 'https://api.spotify.com';

const apiUrl: ApiPropsType = {
  DEV: 'http://192.168.100.33:3000',
};

const env = apiUrl.DEV;
export const apiEndpoint = env;


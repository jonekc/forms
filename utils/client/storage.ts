const TOKEN_KEY = 'token';

const getUserToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export { TOKEN_KEY, getUserToken };

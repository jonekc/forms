const getDecodedToken: (
  token: string,
) => {} | { userId: string; role?: string } = (token) => {
  try {
    return JSON.parse(
      Buffer.from(token.split('.')[1] || '', 'base64').toString('utf8'),
    );
  } catch (error) {
    return {};
  }
};

export { getDecodedToken };

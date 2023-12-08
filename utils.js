// Add all the allowed email providers here
const emailProvidersAllowed = ['pgp.isb.edu'];

const isEmailValid = (email) => {
  const provider = email.split('@');
  return emailProvidersAllowed.includes(provider[1]);
};

module.exports = { isEmailValid };

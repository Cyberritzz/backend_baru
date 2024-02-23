function otpGenerate(length = 6) {
  const num = "0123456789";
  let result = "";
  const max = num.length;

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * max);
    result += num[index];
  }

  return result;
}

export default otpGenerate;

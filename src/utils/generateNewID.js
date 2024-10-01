const generateNewID = data => Math.max(...data.map(item => item.id), 0) + 1;

export { generateNewID };

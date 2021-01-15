module.exports =  (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1; stale-while-revalidate')
  res.send('<h1>Hello!</h1>');
};

var translate = require('node-google-translate-skidz');

module.exports = {
  post: async (req, res) => {
    console.log('POST');
    try {
      translate(
        {
          text: req.body.q,
          source: 'en',
          target: 'es',
        },
        (result) => {
          return res.status(200).json({
            status: 'ok',
            translation: result.translation,
          });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'error',
        msg: 'Ha ocurrido un error en el servidor.',
        error,
      });
    }
  },
};

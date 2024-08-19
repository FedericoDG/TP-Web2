var translate = require('node-google-translate-skidz');

module.exports = {
  post: async (req, res) => {
    try {
      const results = await Promise.all(
        req.body.list.map(
          async ({ q }) =>
            await translate(
              {
                text: q,
                source: 'en',
                target: 'es',
              },
              (result) => {
                return result;
              }
            )
        )
      );

      return res.json({ translations: results.map((el) => ({ translation: el.translation })) });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        msg: 'Ha ocurrido un error en el servidor.',
        error,
      });
    }
  },
};

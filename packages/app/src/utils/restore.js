import async from 'async';

export default (plugins, prompt, cb) => {
  async.eachSeries(plugins, (plugin, callback) => {
    const questions = ((plugin.prompts() || {}).restore || []);

    prompt(plugin.name, questions, (error, answers) => {
      if (error) {
        return callback(error);
      }

      plugin.restore(answers, callback);
    });
  }, cb);
};

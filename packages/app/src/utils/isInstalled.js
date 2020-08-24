import semver from 'semver';

export default need => (item) => {
  let frags = item.split('@');

  if (frags.length === 3) {
    frags = [`@${frags[1]}`, frags[2]];
  }

  return frags[0] === need.name && semver.satisfies(frags[1], need.version);
};

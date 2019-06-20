const axios = require('axios');

const id = "YOUR_CLIENT_ID";
const sec = "YOUR_SECRET_ID";
const params = `?client_id=${id}&client_secret=${sec}`;

getProfile = (username) => {
  return axios.get(`https://api.github.com/users/${username}${params}`)
    .then(({data}) => data);
}

getRepos = (username) => {
  return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`);
}

getStarCount = (repos) => {
  return repos.data.reduce((count, {stargazers_count}) => count + stargazers_count, 0);
}

calculateScore = ({followers}, repos) => {
  return (followers * 3);
}

handleError = (error) => {
  console.warn(error);
  return null;
}

getUserData = (player) => {
  return Promise.all([
    getProfile(player),
    getRepos(player)
  ]).then(([profile, repos]) => ({
      profile,
      score: calculateScore(profile, repos)
  }));
}

sortPlayers = (players) => {
  return players.sort((a,b) => b.score - a.score)
}

module.exports = {
  battle: (players) => {
    return axios.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError);
  },
  fetchPopularRepos: (language) => {
    const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);

    return axios.get(encodedURI).then((response) => response.data.items)
  }
};
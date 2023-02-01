const htmlHeader = require('../partials/htmlheader');
const getDateGames = require('../crawlers/scores')

const displayTeam = team => {
  switch(team) {
    case 'GS': return 'GSW';
    case 'NY': return 'NYK';
    case 'SA': return 'SAS';
    default: return team;
      
  }
}

module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'text/html');

  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  const games = await (await getDateGames(yesterday)).sort((a, b) => a.delta > b.delta ? 1 : -1)
  
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    ${htmlHeader}
    <body>
      <textarea cols="50" rows="20">`;
      html += `Replay assistant\n\n`
        
      games.forEach(game => {
        html += `${game.delta < 6 ? '🟩' : '⬛'} ${displayTeam(game.teamA)}-${displayTeam(game.teamB)}\n`
      })

      html += `\n\n🟩 final score difference < 8\n`
      html += `</textarea>
    </body>
  </html>`;

  return res.send(html);
}

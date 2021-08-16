const readline = require("readline");
const http = require("http");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * this function is used to print all players using foreach
 * it's a simple solution, but it's not the best one 
 */
const printPlayersWithForeach = (players, input) => {
    console.time('printPlayersWithForeach');
    let forkPlayers = [];
    
    players.forEach((player, i, arr) => {
         arr.forEach((player2) => {
             if (player.height + player2.height === input) {
                 let result = player.full_name < player2.full_name ? `${player.full_name} ${player2.full_name}` : `${player2.full_name} ${player.full_name}`;
                 forkPlayers.indexOf(result) === -1 && forkPlayers.push(result);
             }
         });
     });

     console.log(forkPlayers.length ? forkPlayers.join("\n") : "No matches found");
     console.timeEnd('printPlayersWithForeach');
};

/**
 * print all players using reduce function:
 * fun fact: this solution take only next players, not all players
*/
const printPlayersWithReduce = (players, input) => {
    console.time('printPlayersWithReduce');
    let forkPlayers = [];

    players.reduce((prev, curr) => {
        if (prev.height + curr.height === input) {
            let result = prev.full_name < curr.full_name ? `${prev.full_name} ${curr.full_name}` : `${curr.full_name} ${prev.full_name}`;
            forkPlayers.indexOf(result) === -1 && forkPlayers.push(result);
        }
        return curr;
    });

     console.log(forkPlayers.length ? forkPlayers.join("\n") : "No matches found");
     console.timeEnd('printPlayersWithReduce');
};

/**
 * Interface that open the interactive part with the user
*/
const openUserInterface = () => {
    rl.question("Enter a number: ", async (input = '159') =>{
        let players = await getData();
        let playerList = players.values;
        playerList = playerList.map(player => ({
            full_name: `${player.first_name} ${player.last_name}`,
            height: Number(player.h_in)
        }));

        printPlayersWithForeach(playerList, Number(input));
        printPlayersWithReduce(playerList, Number(input));

        openUserInterface();
    });
};

rl.on("close", () => {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});


const getData = () => new Promise((resolve, reject) => {
    const options = {
        host: "mach-eight.uc.r.appspot.com",
        path: "/",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    http.request(options, (res) => {
        let data = "";
        res.setEncoding("utf8");
        res
        .on("data", (chunk) => data += chunk)
        .on("end", () => resolve(JSON.parse(data)))
        .on("error", (e) => reject(e.message));
    }).end();
});


(async () => {
    openUserInterface();
})();
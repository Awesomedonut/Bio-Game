import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/leaderboard.css';
import { backendUri } from '../Constants';

type LeaderboardProps = {
    closeLeaderboard: () => void;
}

interface score {
    level: number,
    score: number,
    username: String
}

const Leaderboard: React.FC<LeaderboardProps> = ({ closeLeaderboard }) => {
    const [level, setLevel] = useState(1);
    const [scores, setScores] = useState<score[]>([]);

    useEffect(() => {
        axios.get(backendUri + `/score/highscores/level/${1}`).then((res) => {setScores(res.data)})
    }, [])
  
   // const backendUri = "https://backend-dot-group-project372.uw.r.appspot.com/";
    // const backendUri ="http://localhost:4000"
    const getScoresForLevel = async (level: number) => {
        const res = await axios.get(backendUri + `/score/highscores/level/${level}`)
        setScores(res.data);
    }

    const handleLevelSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedLevel = parseInt(event.target.value);
        setLevel(selectedLevel);
        getScoresForLevel(selectedLevel);
    }
  
    return (
      <div className='leaderboardContainer'>
        <div className="leaderboard">
            <div className="leaderboardHeader">
                <h1>Highscores</h1>
                <div className="closeButton" onClick={closeLeaderboard}>
                    Close
                </div>
            </div>

            <div className="leaderboardRadioButtonContainer">
                <label htmlFor="level1" className={level == 1 ? "checked" : "unchecked"}>
                    <input id="level1" type="radio" name="level" value={1} checked={level === 1} onChange={handleLevelSelect}/>
                    Level 1
                </label>

                <label htmlFor="level2" className={level == 2 ? "checked" : "unchecked"}>
                    <input id="level2" type="radio" name="level" value={2} checked={level === 2} onChange={handleLevelSelect}/>
                    Level 2
                </label>

                <label htmlFor="level3" className={level == 3 ? "checked" : "unchecked"}>
                    <input id="level3" type="radio" name="level" value={3} checked={level === 3} onChange={handleLevelSelect}/>
                    Level 3
                </label>
            </div>

            <div className="scoresContainer">
                <ul>
                    {
                        (scores.length == 0)
                            ? <li>No scores recorded</li>
                            : scores.map((score, index) => (
                                <li key={index}><span>{`${index + 1}. ${score.username}`}</span> <span>{score.score}</span></li>
                            ))
                    }
                </ul>
            </div>

        </div>
      </div>
    );
  };
  
  export default Leaderboard;
  

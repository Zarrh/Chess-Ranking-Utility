import React, { useState, useEffect } from 'react';
import "./GeneralRanking.scss";
import "./Buttons.css";
import { presenceImg, presenceImgBg, logo, firstLogo, secondLogo, thirdLogo } from '../assets';

import { usePDF } from 'react-to-pdf';

const GeneralRanking = () => {

  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

  const [ranking, setRanking] = useState([]);
  const [standings, setStandings] = useState({id: "1", date: "01-03-2025", players: [{name: "A", pts: "1", ptsGP: "1"}]});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isGeneral, setIsGeneral] = useState(true);

  useEffect(() => {
    fetch('/ranking.yaml')
     .then(response => response.json())
     .then(data => setRanking(data["players"]));

    fetch('/standings')
    .then(response => response.json())
    .then(data => setStandings(data));
  }, []);


  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: "60px",
        marginLeft: "60px",
      }}
      >
        <button onClick={() => toPDF()} style={{}}>GeneratePDF</button>
        <label className="switch" onChange={() => {setIsGeneral(!isGeneral)}}>
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </div>
      {isGeneral && (
        <div 
          ref={isGeneral && targetRef} 
          className={"general"} 
          style={{
            paddingRight: "50px", 
            paddingLeft: "50px", 
            paddingTop: "20px", 
            paddingBottom: "60px"
          }}
        >
          <div className={"title"}>
            <h1>Classifica Campionato Sociale</h1>
            <img alt={"logo"} src={logo} style={{height: "220px", width: "auto"}}/>
          </div>
          <div className={"grid"}>
            <div className={"header-cell center-cell"}>
              Pos
            </div>
            <div className={"header-cell center-cell"}>
              Nome
            </div>
            <div className={"header-cell center-cell"}>
              PtsGP
            </div> 
            <div className={"header-cell center-cell"}>
              Presenze
            </div>
            {ranking.map((player, index) => (
              <>
                <div className={"empty-cell center-cell border-bottom border-left"} key={index*4}>
                  {index+1}
                </div>
                <div className={"empty-cell center-cell border-bottom"} key={index*4+1}>
                  {player.name}
                </div>
                <div className={"filled-cell center-cell"} key={index*4+2}>
                  {player.points}
                </div> 
                <div className={"empty-cell start-cell border-bottom border-right"} key={index*4+3}>
                  <div className={"presences-container"}>
                    {player.presences <= 10 ? 
                      Array(player.presences).fill(0).map((_, index) => (
                        <div style={{display: "flex", height: "100%", alignContent: "center", justifyContent: "center"}}>
                          <img key={index} src={presenceImg} />
                        </div>
                      ))
                      : (
                        <>
                          {Array(10).fill(0).map((_, index) => (
                            <div style={{display: "flex", height: "100%", alignContent: "center", justifyContent: "center"}}>
                              <img key={index} src={presenceImg} />
                            </div>
                          ))}
                          <div style={{position: "relative", display: "flex", height: "100%", alignContent: "center", justifyContent: "center"}}>
                            <img key={index} src={presenceImgBg} />
                            <span style={{
                              color: "white",
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-60%, -45%)",
                              fontSize: player.presences < 20 ? "18px" : "16px",
                            }}>
                              +{player.presences - 10}
                            </span>
                          </div>
                        </>
                      )
                    }
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      )}
      {!isGeneral && (
        <div 
          ref={!isGeneral && targetRef} 
          className={"specific"} 
          style={{
            paddingRight: "50px", 
            paddingLeft: "50px", 
            paddingTop: "20px", 
            paddingBottom: "60px"
          }}
        >
          <div className={"title"}>
            <div>
              <h1>{standings["id"]}° Torneo Sociale - Queen Club</h1>
              <p>Classifica <span className={"title-date"}>{standings["date"]}</span></p>
            </div>
            <img alt={"logo"} src={logo} style={{height: "280px", width: "auto"}}/>
          </div>
          <div className={"grid"}>
            <div className={"header-cell center-cell"}>
              Pos
            </div>
            <div className={"header-cell center-cell"}>
              Nome
            </div>
            <div className={"header-cell center-cell"}>
              Pts
            </div> 
            <div className={"header-cell center-cell"}>
            </div>
            <div className={"header-cell center-cell"}>
              PtsGP
            </div>
            <div className={"header-cell center-cell"}>
            </div>
            {standings["players"].map((player, index) => (
              <>
                <div className={"empty-cell center-cell border-bottom border-left"} key={index*6}>
                  {index+1}
                </div>
                <div className={`${index===0 && "text-gold"} empty-cell center-cell border-bottom`} key={index*6+1}>
                  <span style={{position: "absolute"}}>{player.name}</span>
                  {index === 0 && (
                    <img
                      src={firstLogo}
                      alt="logo"
                      style={{
                        height: '50px',
                        verticalAlign: 'middle',
                        marginLeft: '500px',
                        position: "absolute",
                      }}
                    />
                  )}
                  {index === 1 && (
                    <img
                      src={secondLogo}
                      alt="logo"
                      style={{
                        height: '50px',
                        verticalAlign: 'middle',
                        marginLeft: '500px',
                        position: "absolute",
                      }}
                    />
                  )}
                  {index === 2 && (
                    <img
                      src={thirdLogo}
                      alt="logo"
                      style={{
                        height: '50px',
                        verticalAlign: 'middle',
                        marginLeft: '500px',
                        position: "absolute",
                      }}
                    />
                  )}
                </div>
                <div className={`${index===0 && "text-gold"} filled-cell center-cell`} key={index*6+2}>
                  {player.pts}
                </div> 
                <div className={"empty-cell border-bottom"} key={index*6+3}>
                </div>
                <div className={`${index===0 && "text-gold"} filled-cell center-cell border-bottom`} key={index*6+4}>
                  {player.ptsGP}
                </div>
                <div className={"empty-cell border-bottom border-right"} key={index*6+5}>
                </div>
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default GeneralRanking;
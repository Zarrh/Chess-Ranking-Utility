import React, { useState, useEffect } from 'react';
import "./GeneralRanking.scss";
import "./Buttons.css";
import { presenceImg, presenceImgBg, logo, firstLogo, secondLogo, thirdLogo } from '../assets';

import { usePDF } from 'react-to-pdf';

const GeneralRanking = () => {

  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

  const [ranking, setRanking] = useState([]);
  const [standings, setStandings] = useState({});

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
          {Array.from({ length: Math.ceil(ranking.length / 32) }, (_, pageIndex) => {
            const chunk = ranking.slice(pageIndex * 32, (pageIndex + 1) * 32);

            return (
              <div
                key={pageIndex}
                style={{ pageBreakAfter: pageIndex !== Math.ceil(ranking.length / 32) - 1 ? 'always' : 'auto', marginTop: pageIndex > 0 && '40px' }}
              >
                <div className={"title"}>
                  <h1>Classifica Campionato Sociale</h1>
                  <img alt={"logo"} src={logo} style={{ height: "220px", width: "auto" }} />
                </div>

                <div className={"grid"}>
                  <div className={"header-cell center-cell"}>Pos</div>
                  <div className={"header-cell center-cell"}>Nome</div>
                  <div className={"header-cell center-cell"}>PtsGP</div>
                  <div className={"header-cell center-cell"}>Presenze</div>

                  {chunk.map((player, i) => {
                    const globalIndex = pageIndex * 32 + i;

                    return (
                      <React.Fragment key={globalIndex}>
                        <div className={"empty-cell center-cell border-bottom border-left"}>
                          {globalIndex + 1}
                        </div>
                        <div className={"empty-cell center-cell border-bottom"}>
                          {player.name}
                        </div>
                        <div className={"filled-cell center-cell"}>
                          {player.points}
                        </div>
                        <div className={"empty-cell start-cell border-bottom border-right"}>
                          <div className={"presences-container"}>
                            {player.presences <= 10 ? (
                              Array(player.presences).fill(0).map((_, i) => (
                                <div key={i} style={{ display: "flex", height: "100%", justifyContent: "center" }}>
                                  <img src={presenceImg} />
                                </div>
                              ))
                            ) : (
                              <>
                                {Array(10).fill(0).map((_, i) => (
                                  <div key={i} style={{ display: "flex", height: "100%", justifyContent: "center" }}>
                                    <img src={presenceImg} />
                                  </div>
                                ))}
                                <div style={{ position: "relative", display: "flex", height: "100%", justifyContent: "center" }}>
                                  <img src={presenceImgBg} />
                                  <span
                                    style={{
                                      color: "white",
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-60%, -45%)",
                                      fontSize: player.presences < 20 ? "18px" : "16px",
                                    }}
                                  >
                                    +{player.presences - 10}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
          {Array.from({ length: Math.ceil(standings["players"].length / 31) }, (_, pageIndex) => {
            const playersChunk = standings["players"].slice(pageIndex * 31, (pageIndex + 1) * 31);

            return (
              <div
                key={pageIndex}
                className="standings-page"
                style={{ pageBreakAfter: pageIndex !== Math.ceil(standings["players"].length / 31) - 1 ? 'always' : 'auto' }}
              >
                <div className={"title"}>
                  <div>
                    <h1>{standings["id"]}° Torneo Sociale - Queen Club</h1>
                    <p>Classifica <span className={"title-date"}>{standings["date"]}</span></p>
                  </div>
                  <img alt={"logo"} src={logo} style={{ height: "280px", width: "auto" }} />
                </div>

                <div className={"grid"}>
                  <div className={"header-cell center-cell"}>Pos</div>
                  <div className={"header-cell center-cell"}>Nome</div>
                  <div className={"header-cell center-cell"}>Pts</div>
                  <div className={"header-cell center-cell"}></div>
                  <div className={"header-cell center-cell"}>PtsGP</div>
                  <div className={"header-cell center-cell"}></div>

                  {playersChunk.map((player, index) => {
                    const globalIndex = pageIndex * 31 + index;

                    return (
                      <React.Fragment key={globalIndex}>
                        <div className={"empty-cell center-cell border-bottom border-left"}>
                          {globalIndex + 1}
                        </div>
                        <div className={`${globalIndex === 0 && "text-gold"} empty-cell center-cell border-bottom`}>
                          <span style={{ position: "absolute" }}>{player.name}</span>
                          {[firstLogo, secondLogo, thirdLogo][globalIndex] && (
                            <img
                              src={[firstLogo, secondLogo, thirdLogo][globalIndex]}
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
                        <div className={`${globalIndex === 0 && "text-gold"} filled-cell center-cell`}>
                          {player.pts}
                        </div>
                        <div className={"empty-cell border-bottom"}></div>
                        <div className={`${globalIndex === 0 && "text-gold"} filled-cell center-cell border-bottom`}>
                          {player.ptsGP}
                        </div>
                        <div className={"empty-cell border-bottom border-right"}></div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default GeneralRanking;
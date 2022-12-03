import {AppLayout} from "common/layouts/app-layout";
import React, {useEffect, useState} from "react";
import {Card, Col, Row, Spin} from "antd";
import axios from "axios";
import Image from 'next/image'

const DevStatsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([{
    avatar: 'https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png',
    text: '--'
  }, {
    avatar: 'https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png',
    text: '--'
  }, {
    avatar: 'https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png',
    text: '--'
  }]);

  useEffect(() => {
    axios.get("/api/waka/get-stats").then(response => {
      const data = response.data;
      let stats = data.data;
      stats = stats.sort((a, b) => {
        return b['total_seconds'] - a['total_seconds'];
      });
      setLeaderboardData(stats);
      setIsLoading(false);
    });
  }, []);
  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={10} xl={6}>
          <Spin spinning={isLoading}>
            <Card style={{
              backgroundColor: "#2a2828",
              textAlign: "center"
            }}>
              <h2 style={{color: "#ffefb0", fontSize: 30, fontWeight: 800}}>LEADERBOARD</h2>
              <p style={{color: "#ffefb0", marginBottom: 30}}>Top active developer this week.</p>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "space-evenly",
                alignItems: 'center',
              }}>
                <div style={{
                  position: "relative",
                  padding: 4,
                  border: "2px solid white",
                  borderRadius: 500
                }}>
                  <Image
                    alt={'avatar'}
                    src={leaderboardData[1].avatar}
                    width={75}
                    height={75}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: -5,
                    left: 0,
                    width: "100%",
                    alignSelf: "center",
                  }}>
                    <span style={{
                      backgroundColor: "white",
                      fontSize: 10,
                      padding: "2px 6px",
                      color: "black",
                      borderRadius: 10
                    }}>
                      {leaderboardData[1].text}
                    </span>
                  </div>
                </div>
                <div style={{
                  position: "relative",
                  padding: 4,
                  border: "2px solid #ffefb0",
                  borderRadius: 500
                }}>
                  <Image
                    alt={'avatar'}
                    src={leaderboardData[0].avatar}
                    width={100}
                    height={100}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: -5,
                    left: 0,
                    width: "100%",
                    alignSelf: "center",
                  }}>
                    <span style={{
                      backgroundColor: "#ffefb0",
                      fontSize: 12,
                      padding: "4px 8px",
                      color: "black",
                      borderRadius: 20
                    }}>
                      {leaderboardData[0].text}
                    </span>
                  </div>
                </div>
                <div style={{
                  position: "relative",
                  padding: 4,
                  border: "2px solid white",
                  borderRadius: 500
                }}>
                  <Image
                    alt={'avatar'}
                    src={leaderboardData[2].avatar}
                    width={75}
                    height={75}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: -5,
                    left: 0,
                    width: "100%",
                    alignSelf: "center",
                  }}>
                    <span style={{
                      backgroundColor: "white",
                      fontSize: 10,
                      padding: "2px 6px",
                      color: "black",
                      borderRadius: 10
                    }}>
                      {leaderboardData[2].text}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{paddingTop: 20, margin: 0, fontSize: 10, fontStyle: "italic", color: "#FFFFFF33"}}>
                Statistics are taken from WakaTime
              </p>
            </Card>
          </Spin>
        </Col>
        <Col span={12}>

        </Col>
      </Row>
    </>
  )
};

DevStatsPage.getLayout = (page) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default DevStatsPage;

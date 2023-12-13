import { useContext, useEffect, useState } from "react";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
import { VideoMeeting } from "../VideoMeeting";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import { DYTE_URL, ENCODED_STR } from "../../constants/dyteConstants";
import { Loading } from "../Loading";

export const MeetingWrapper = () => {
  const [meeting, initMeeting] = useDyteClient();
  const { roomId } = useParams();
  const { userData } = useContext(UserContext);
  const [token, setToken] = useState();

  useEffect(() => {
    if (roomId) {
      const dyteReq = fetch(`${DYTE_URL}/meetings/${roomId}/participants`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Basic ${ENCODED_STR}`,
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          name: `${userData?.username}`,
          picture: `${userData?.avatarUrl}`,
          preset_name: "group_call_participant",
          custom_participant_id: `${userData?.uid}`,
        }),
      });

      let dyteRes;
      let authData;

      (async () => {
        dyteRes = await dyteReq;
        authData = await dyteRes.json();
        setToken(authData.data.token);
      })();

      if (token) {
        initMeeting({
          authToken: token!,
          defaults: {
            audio: false,
            video: false,
          },
        });
      }
    }
  }, [token]);

  return (
    <DyteProvider value={meeting} fallback={<Loading />}>
      <VideoMeeting />
    </DyteProvider>
  );
};

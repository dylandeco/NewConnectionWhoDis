import { Avatar, Box, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CredentialsContext from "src/store/credentials-context";

const InboxLikeItem = (props) => {
  const getCredentialsHandler = useContext(CredentialsContext);
  const item = props.item;
  const navigate = useNavigate();

  const [followerPic, setFollowerPic] = useState("");
  const [followerName, setFollowerName] = useState("");

  const fetchInbox = useCallback(async () => {
    let credentials = getCredentialsHandler(item.author.host);
    const response = await fetch(`${item.author.id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ` + btoa(credentials),
      },
    });
    if (response.ok) {
      const data = await response.json();
      setFollowerPic(data["profileImage"]);
      setFollowerName(data["displayName"]);
    } else {
      console.log("InboxLikeItem useEffect failed - fetching inbox");
    }
  }, [item.author, getCredentialsHandler]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${item.object}`, {
        headers: {
          Authorization: `Basic ` + btoa("admin:NewConnectionAdmin"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        const author_array = data.author.id.split("/");
        const author_id = author_array[author_array.length - 1];
        const post_array = data.id.split("/");
        const post_id = post_array[post_array.length - 1];
        navigate(`/app/author/${author_id}/post/${post_id}`, { state: data }); // state contains the post
      }
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        py: 0,
      }}
      // Navigate to the ViewPost page, pass the entire item into the state for ViewPost to use
      onClick={() => {
        fetchPost();
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="Avatar"
          src={followerPic}
          sx={{
            width: 17,
            height: 17,
            marginRight: 1,
            cursor: "pointer",
            border: 1,
            borderColor: "gray",
          }}
          onClick={() => {
            const words = item.author.id.split("/");
            const word = words[words.length - 1];
            navigate(`/app/author/${word}`, { state: item.author });
          }}
        />
        <Typography variant="body2">
          <b>{followerName}</b> liked your post
        </Typography>
      </Box>
    </Box>
  );
};

export default InboxLikeItem;

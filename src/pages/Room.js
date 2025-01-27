import React, { useState, useEffect } from "react";
import {
   Container,
   Card,
   CardMedia,
   Button,
   Slide,
   Typography,
   TextField,
   Grid,
   FormControl,
   InputLabel,
   Select,
   CardContent,
   MenuItem,
   CardActions,
   Fade,
   Backdrop,
   Divider,
   IconButton,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import LoadingState from "../components/LoadingState";
import { useHistory } from "react-router-dom";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import DeleteIcon from "@mui/icons-material/Delete";

import LoadingButton from "@mui/lab/LoadingButton";
import CustomInputPicture from "../components/CustomInputPicture";
import { domain } from "../fetch-url/fetchUrl";
import RoomToggler from "../components/RoomToggler";
import BackNavbar from "../components/BackNavbar";
import Notification from "../components/Notification";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Axios from "axios";

const Room = () => {
   const { roomId } = useParams();
   const history = useHistory();

   const [message, setMessage] = useState("");
   const [showMessage, setShowMessage] = useState(false);
   const [messageSeverity, setMessageSeverity] = useState("warning");

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [roomDeleteConfirm, setRoomDeleteConfirm] = useState("");
   const [deleteIsPending, setDeleteIsPending] = useState(false);

   const [isEditable, setIsEditable] = useState(!false);
   const [isPictureEditable, setIsPictureEditable] = useState(false);

   const [isRoomSavePending, setIsRoomSavePending] = useState(false);
   const [savePictureIsPending, setSavePictureIsPending] = useState(false);

   const [roomDescription, setRoomDescription] = useState("");
   const [totalSlots, setTotalSlots] = useState(0);
   const [occupiedSlots, setOccupiedSlots] = useState(0);

   const [roomName, setRoomName] = useState("");
   const [roomPrice, setRoomPrice] = useState(0);
   const [roomType, setRoomType] = useState("");
   const [genderAllowed, setGenderAllowed] = useState("Male/Female");
   const [roomPicture, setRoomPicture] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);
   const [imageName, setImageName] = useState();

   const [boardinghouseName, setBoardinghouseName] = useState("");

   const [boardinghouse, setBoardinghouse] = useState({});

   const incrementTotal = () => {
      setTotalSlots(totalSlots + 1);
   };
   const decrementTotal = () => {
      setTotalSlots(totalSlots - 1);
   };
   const incrementOccupied = () => {
      if (occupiedSlots < totalSlots) {
         setOccupiedSlots(occupiedSlots + 1);
      }
   };
   const decrementOccupied = () => {
      setOccupiedSlots(occupiedSlots - 1);
   };

   const {
      data: room,
      isPending,
      error,
   } = useFetch(`${domain}/api/rooms/${roomId}`);

   const handleSaveEdits = (e) => {
      e.preventDefault();
      setIsRoomSavePending(true);
      fetch(`${domain}/api/rooms/update/${roomId}`, {
         method: "PUT",
         body: JSON.stringify({
            roomName: roomName,
            roomPrice: roomPrice,
            roomDescription: roomDescription,
            roomType: roomType,
            roomStatus: "Available",
            genderAllowed: genderAllowed,
            totalSlots: totalSlots,
            occupiedSlots: occupiedSlots,
         }),
         headers: {
            "Content-Type": "application/json",
         },
      })
         .then((res) => res.json())
         .then((data) => {
            console.log(data.message);
            setIsEditable(!isEditable);
            setIsRoomSavePending(false);

            setMessage(data.message);
            setMessageSeverity("success");
            setShowMessage(true);
            setDeleteIsPending(false);
            setIsModalOpen(false);
         })
         .catch((err) => console.log(err));
   };

   const handleCancelEdits = () => {
      setIsEditable(!isEditable);
      setImagePreview(null);
      setRoomPicture(null);
      setImageName("");
   };

   const handleSavePicture = () => {
      // WHAT WILL hAPPEN?
      //upload new picture and get the new link
      //delete the old picture from file system
      //update new link in the room picture datbase

      if (roomPicture) {
         setSavePictureIsPending(true);
         // const formData = new FormData();
         // formData.append("room-image", roomPicture);

         const formData = new FormData();
         formData.append("file", roomPicture);
         formData.append("upload_preset", "bwqfoub6");

         fetch(`${domain}/api/rooms/delete-picture/${roomId}`)
            .then((res) => res.json())
            .then((data) => {
               console.log(data.message);

               // fetch(`${domain}/api/rooms/upload`, {
               //    method: "POST",
               //    body: formData,
               // })
               //    .then((res) => {
               //       return res.json();
               //    })
               //    .then((newImage) => {

               Axios.post(
                  "https://api.cloudinary.com/v1_1/searchnstay/image/upload",
                  formData
               )
                  .then((image) => {
                     console.log(image.data.secure_url);
                     setRoomPicture(image.data.secure_url);

                     fetch(
                        `${domain}/api/rooms/update-room-picture/${roomId}`,
                        {
                           method: "PUT",
                           body: JSON.stringify({
                              newImageLink: image.data.secure_url,
                           }),
                           headers: {
                              "Content-Type": "application/json",
                           },
                        }
                     )
                        .then((res) => {
                           return res.json();
                        })
                        .then((data) => {
                           setIsPictureEditable(false);
                           setSavePictureIsPending(false);
                           setImagePreview(null);
                           setRoomName("");

                           setMessage(data.message);
                           setMessageSeverity("success");
                           setShowMessage(true);
                           setDeleteIsPending(false);
                           setIsModalOpen(false);

                           setTimeout(() => {
                              window.location.reload(false);
                           }, 500);
                        })
                        .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
            })

            .catch((err) => console.log(err));
      } else {
         console.log("Cannot be null");
      }
   };
   const handleCancelUpdatePicture = () => {
      setIsPictureEditable(false);
      setRoomPicture(null);
      setImagePreview(null);
      setImageName("");
   };

   const handleRoomDelete = (roomId, roomName) => {
      if (roomDeleteConfirm === roomName) {
         setDeleteIsPending(true);
         fetch(`${domain}/api/rooms/delete/${roomId}`, {
            method: "DELETE",
         })
            .then((res) => res.json())
            .then((data) => {
               setTimeout(() => {
                  history.goBack();
               }, 1500);
               setMessage(data.message);
               setMessageSeverity("success");
               setShowMessage(true);
               setDeleteIsPending(false);
               setIsModalOpen(false);
            })
            .catch((err) => console.log(err));
      } else {
         setMessage("Room name is incorrect!");
         setMessageSeverity("warning");
         setShowMessage(true);
         setIsModalOpen(true);
      }
   };

   const handleModalClose = () => {
      setIsModalOpen(false);
   };

   useEffect(() => {
      if (room && boardinghouse) {
         setRoomName(room.name);
         setRoomPrice(room.price ?? 0);
         setRoomDescription(room.description);
         setTotalSlots(room.totalSlots);
         setOccupiedSlots(room.occupiedSlots);
         setRoomType(room.type);
         setGenderAllowed(room.genderAllowed);
         setRoomPicture(room.picture);
         setBoardinghouseName(boardinghouse.name);
      }
   }, [room, boardinghouse]);

   useEffect(() => {
      if (room) {
         fetch(`${domain}/api/boarding-houses/${room.boardinghouseId}`)
            .then((res) => res.json())
            .then((data) => {
               setBoardinghouse(data);
            })
            .catch((err) => {
               console.log(err);
            });
      }
   }, [room]);

   return (
      <Slide in={true} direction="left">
         <Container disableGutters maxWidth="xl">
            {error && (
               <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 5, fontFamily: "Quicksand" }}
               >
                  {error}
               </Typography>
            )}
            {isPending && <LoadingState />}
            {room && (
               <>
                  {boardinghouse && (
                     <>
                        <Modal
                           closeAfterTransition
                           BackdropComponent={Backdrop}
                           BackdropProps={{
                              timeout: 500,
                           }}
                           open={isModalOpen}
                           onClose={handleModalClose}
                        >
                           <Fade in={isModalOpen}>
                              <Container
                                 maxWidth="xl"
                                 disableGutters
                                 sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    mt: -7,
                                    px: 2,
                                 }}
                              >
                                 <Box
                                    sx={{
                                       zIndex: 100,
                                       width: 400,
                                       bgcolor: "background.paper",
                                       borderRadius: ".5rem",
                                       boxShadow: 10,
                                       p: 2,
                                       py: 2,
                                       height: "max-content",
                                       flexDirection: "column",
                                       display: "flex",
                                    }}
                                 >
                                    <CloseOutlined
                                       sx={{ alignSelf: "flex-end" }}
                                       onClick={handleModalClose}
                                       color="warning"
                                    />

                                    <Box
                                       sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          gap: 1,
                                       }}
                                    >
                                       <DeleteIcon
                                          sx={{
                                             height: "3rem",
                                             width: "3rem",
                                             color: red[500],
                                          }}
                                       />
                                       <Typography
                                          variant="body1"
                                          align="center"
                                          sx={{
                                             fontFamily: "Quicksand",
                                             mb: 1,
                                          }}
                                       >
                                          Delete{" "}
                                          <Typography
                                             variant=" caption"
                                             sx={{
                                                color: red[500],
                                             }}
                                          >
                                             {room.name}
                                          </Typography>{" "}
                                          (room) ?
                                       </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 1 }} />
                                    <Typography variant="caption ">
                                       Enter the room name to confirm deletion.{" "}
                                    </Typography>

                                    <TextField
                                       size="small"
                                       color="secondary"
                                       value={roomDeleteConfirm}
                                       onChange={(e) =>
                                          setRoomDeleteConfirm(e.target.value)
                                       }
                                       autoFocus
                                       label="Room name"
                                       fullWidth
                                       margin="normal"
                                    />
                                    <LoadingButton
                                       variant="contained"
                                       color="secondary"
                                       disableElevation
                                       size="small"
                                       fullWidth
                                       loading={deleteIsPending}
                                       onClick={() => {
                                          handleRoomDelete(room.id, room.name);
                                       }}
                                    >
                                       Confirm
                                    </LoadingButton>
                                 </Box>
                              </Container>
                           </Fade>
                        </Modal>

                        <Notification
                           message={message}
                           setShowMessage={setShowMessage}
                           messageSeverity={messageSeverity}
                           showMessage={showMessage}
                        />
                        <BackNavbar
                           title={room.name}
                           subtitle={`Room by ${boardinghouseName}`}
                        >
                           <Button
                              variant="contained"
                              disableElevation
                              size="small"
                              sx={{
                                 background: red[500],
                                 "&:hover": {
                                    background: red[800],
                                 },
                              }}
                              onClick={() => setIsModalOpen(true)}
                           >
                              Delete
                           </Button>
                        </BackNavbar>

                        <Container
                           disableGutters
                           maxWidth="md"
                           sx={{ padding: 2, paddingTop: 3, paddingBottom: 5 }}
                        >
                           <Grid container spacing={2}>
                              {isPictureEditable ? (
                                 <Grid item lg={5} sm={6} xs={12}>
                                    <Card
                                       sx={{
                                          padding: 1,
                                       }}
                                    >
                                       <Box
                                          sx={{
                                             display: "flex",
                                             justifyContent: "flex-end",
                                             padding: 0,
                                             marginBottom: 2,
                                             gap: 1,
                                          }}
                                       >
                                          <Button
                                             variant="contained"
                                             onClick={handleCancelUpdatePicture}
                                             size="small"
                                             disableElevation
                                             color="secondary"
                                          >
                                             cancel
                                          </Button>
                                          <LoadingButton
                                             variant="contained"
                                             onClick={handleSavePicture}
                                             size="small"
                                             disableElevation
                                             disabled={!imageName}
                                             loading={savePictureIsPending}
                                          >
                                             Save
                                          </LoadingButton>
                                       </Box>
                                       <CustomInputPicture
                                          imagePreview={imagePreview}
                                          setImagePreview={setImagePreview}
                                          imageName={imageName}
                                          setImageName={setImageName}
                                          setRoomPicture={setRoomPicture}
                                       />
                                    </Card>
                                 </Grid>
                              ) : (
                                 <Grid item lg={5} sm={6} xs={12}>
                                    <Card sx={{ padding: 1 }}>
                                       <CardActions
                                          sx={{
                                             display: "flex",
                                             justifyContent: "flex-end",
                                             padding: 0,
                                             marginBottom: 2,
                                          }}
                                       >
                                          <Button
                                             variant="contained"
                                             onClick={() =>
                                                setIsPictureEditable(true)
                                             }
                                             size="small"
                                             disableElevation
                                          >
                                             Edit
                                          </Button>
                                       </CardActions>
                                       <Card>
                                          <CardMedia
                                             height="250"
                                             component="img"
                                             alt="room-image"
                                             image={room.picture}
                                          />
                                       </Card>
                                    </Card>
                                 </Grid>
                              )}

                              <Grid item lg={7} sm={6} xs={12}>
                                 <>
                                    <Card>
                                       <Box
                                          sx={{
                                             display: "flex",
                                             justifyContent: "flex-end",
                                             gap: 1,
                                             padding: 1,
                                          }}
                                       >
                                          {isEditable ? (
                                             <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() =>
                                                   setIsEditable(!isEditable)
                                                }
                                                disableElevation
                                             >
                                                edit
                                             </Button>
                                          ) : (
                                             <>
                                                <Button
                                                   variant="contained"
                                                   size="small"
                                                   color="secondary"
                                                   onClick={handleCancelEdits}
                                                   disableElevation
                                                >
                                                   cancel
                                                </Button>
                                                <LoadingButton
                                                   variant="contained"
                                                   size="small"
                                                   color="primary"
                                                   onClick={handleSaveEdits}
                                                   loading={isRoomSavePending}
                                                >
                                                   Save
                                                </LoadingButton>
                                             </>
                                          )}
                                       </Box>

                                       <Box
                                          sx={{
                                             display: "flex",
                                             justifyContent: "space-between",
                                             alignItems: "center",
                                             borderRadius: 1,
                                             padding: ".5rem 1rem",
                                          }}
                                       >
                                          <Typography variant="body1">
                                             Room Status
                                          </Typography>
                                          <RoomToggler
                                             room={room}
                                             isShowLabel={true}
                                          />
                                       </Box>
                                       <CardContent>
                                          <TextField
                                             label="Room Name"
                                             fullWidth
                                             size="small"
                                             variant="outlined"
                                             color="primary"
                                             value={roomName}
                                             autoFocus
                                             required
                                             margin="dense"
                                             sx={{ background: "#fff" }}
                                             onChange={(e) =>
                                                setRoomName(e.target.value)
                                             }
                                             disabled={isEditable}
                                          />

                                          <Box
                                             sx={{
                                                position: "relative",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 1,
                                             }}
                                          >
                                             <span
                                                style={{
                                                   fontSize: 22,
                                                   fontFamily: "Quicksand",
                                                   fontWeight: "bold",
                                                   paddingLeft: 2,
                                                }}
                                             >
                                                ₱
                                             </span>
                                             <TextField
                                                label="Price"
                                                fullWidth
                                                size="small"
                                                type="number"
                                                variant="standard"
                                                color="primary"
                                                value={roomPrice}
                                                required
                                                margin="dense"
                                                sx={{
                                                   background: "#fff",
                                                   width: "93%",
                                                }}
                                                onChange={(e) =>
                                                   setRoomPrice(e.target.value)
                                                }
                                                disabled={isEditable}
                                             />
                                          </Box>
                                          <TextField
                                             label="Room Description (Separate every entry using / sign.)"
                                             fullWidth
                                             size="small"
                                             rows={6}
                                             multiline
                                             variant="outlined"
                                             color="primary"
                                             value={roomDescription}
                                             margin="dense"
                                             sx={{ background: "#fff" }}
                                             onChange={(e) =>
                                                setRoomDescription(
                                                   e.target.value
                                                )
                                             }
                                             disabled={isEditable}
                                          />

                                          <Box
                                             sx={{
                                                display: "flex",
                                                gap: 1,
                                                marginTop: 1,
                                             }}
                                          >
                                             <FormControl
                                                fullWidth
                                                size="small"
                                             >
                                                <InputLabel id="room-type-label">
                                                   Room Type
                                                </InputLabel>
                                                <Select
                                                   labelId="room-type"
                                                   id="room-type"
                                                   value={roomType}
                                                   label="Room Type"
                                                   onChange={(e) =>
                                                      setRoomType(
                                                         e.target.value
                                                      )
                                                   }
                                                   disabled={isEditable}
                                                >
                                                   <MenuItem value={"Studio"}>
                                                      Studio Type
                                                   </MenuItem>
                                                   <MenuItem
                                                      value={"6-person-room"}
                                                   >
                                                      6 Person-room
                                                   </MenuItem>
                                                   <MenuItem
                                                      value={"4-person-room"}
                                                   >
                                                      4 Person-room
                                                   </MenuItem>
                                                   <MenuItem
                                                      value={"2-person-room"}
                                                   >
                                                      2 Person-room
                                                   </MenuItem>
                                                   <MenuItem value={"single"}>
                                                      Single
                                                   </MenuItem>
                                                </Select>
                                             </FormControl>
                                             <FormControl
                                                fullWidth
                                                size="small"
                                             >
                                                <InputLabel id="gender-cat-label">
                                                   Gender Allowed
                                                </InputLabel>
                                                <Select
                                                   labelId="gender-category"
                                                   id="gender-cat"
                                                   value={genderAllowed}
                                                   label="Gender Category"
                                                   onChange={(e) =>
                                                      setGenderAllowed(
                                                         e.target.value
                                                      )
                                                   }
                                                   disabled={isEditable}
                                                >
                                                   <MenuItem
                                                      value={"Male/Female"}
                                                   >
                                                      Male & Female
                                                   </MenuItem>
                                                   <MenuItem value={"Male"}>
                                                      Male Only
                                                   </MenuItem>
                                                   <MenuItem value={"Female"}>
                                                      Female Only
                                                   </MenuItem>
                                                </Select>
                                             </FormControl>
                                          </Box>

                                          <Box
                                             sx={{
                                                display: "flex",
                                                gap: 1,
                                                my: 2,
                                             }}
                                          >
                                             <Box
                                                sx={{
                                                   display: "flex",
                                                   flexGrow: 2,
                                                }}
                                             >
                                                <IconButton
                                                   color="error"
                                                   onClick={decrementTotal}
                                                   disabled={
                                                      totalSlots === 0 ||
                                                      isEditable
                                                   }
                                                >
                                                   <RemoveCircleIcon />
                                                </IconButton>
                                                <TextField
                                                   variant="outlined"
                                                   size="small"
                                                   fullWidth
                                                   label="Total Slots"
                                                   type="number"
                                                   value={totalSlots}
                                                   disabled={isEditable}
                                                   onChange={(e) =>
                                                      setTotalSlots(
                                                         e.target.value
                                                      )
                                                   }
                                                />
                                                <IconButton
                                                   onClick={incrementTotal}
                                                   disabled={isEditable}
                                                   color="success"
                                                >
                                                   <AddCircleIcon />
                                                </IconButton>
                                             </Box>

                                             <Box
                                                sx={{
                                                   display: "flex",
                                                   flexGrow: 2,
                                                }}
                                             >
                                                <IconButton
                                                   onClick={decrementOccupied}
                                                   color="error"
                                                   disabled={
                                                      occupiedSlots === 0 ||
                                                      isEditable
                                                   }
                                                >
                                                   <RemoveCircleIcon />
                                                </IconButton>
                                                <TextField
                                                   variant="outlined"
                                                   size="small"
                                                   fullWidth
                                                   type="number"
                                                   label="Occupied Slots"
                                                   disabled={isEditable}
                                                   value={occupiedSlots}
                                                   onChange={(e) =>
                                                      setOccupiedSlots(
                                                         e.target.value
                                                      )
                                                   }
                                                />

                                                <IconButton
                                                   onClick={incrementOccupied}
                                                   color="success"
                                                   disabled={
                                                      occupiedSlots ===
                                                         totalSlots ||
                                                      isEditable
                                                   }
                                                >
                                                   <AddCircleIcon />
                                                </IconButton>
                                             </Box>
                                             <TextField
                                                variant="outlined"
                                                size="small"
                                                label="Available Slots"
                                                value={
                                                   totalSlots - occupiedSlots
                                                }
                                                disabled
                                                onChange={(e) =>
                                                   setTotalSlots(e.target.value)
                                                }
                                             />
                                          </Box>
                                       </CardContent>
                                    </Card>
                                 </>
                              </Grid>
                           </Grid>
                        </Container>
                     </>
                  )}
               </>
            )}
         </Container>
      </Slide>
   );
};

export default Room;

import express from 'express';
import { addNewClient,  
updateClient,
deleteClient,
getAllClient,
getClientmainById,
getadmindetailsById,
changePassword,



} from '../Controllers/client.js';
const router = express.Router();
router.post('/clients', addNewClient);
// router.get("/clients/:id", getClientById);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);
router.get("/clients", getAllClient);
router.get("/getClientmainById/:id", getClientmainById);
router.get("/getadmindetailsById/:id", getadmindetailsById);

router.put("/changepassword/:userId", changePassword);



export default router;



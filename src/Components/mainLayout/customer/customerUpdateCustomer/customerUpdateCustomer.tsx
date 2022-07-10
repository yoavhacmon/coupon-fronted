import "./customerUpdateCustomer.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { store } from "../../../../redux/store";
import msgNotify, { ErrMsg } from "../../../../util/notify";
import { customer_details } from "../../../../modal/customer_details";
import { useForm } from "react-hook-form";
import jwtAxios from "../../../../util/jwtAxios";
import { Button, ButtonGroup, TextField } from "@mui/material";
import { deleteCustomer, updateCustomer } from "../../../../redux/customerState";
import { SyntheticEvent, useEffect, useState } from "react";
import globals from "../../../../util/globals";

function CustomerUpdateCustomer(): JSX.Element {
        const location = useLocation();
        const {customerId} = location.state as any;
        const [customer, setCustomer] = useState(new customer_details());
        const {register, handleSubmit} = useForm<customer_details>();
        const navigate = useNavigate();
        const getUserType = store.getState().AuthState.userType;
    
        
        useEffect(()=>{
            setCustomer(store.getState().customerState.customer.find(item=>customerId==item.id));
        }, []);
    
        const goBack = ()=>{
                navigate("/customer/customerMainPage");
        }

        
    
        const send = ()=>{
            jwtAxios.put(globals.urls.customerUpdateCustomer,customer)
            .then(response=>{
                if(response.status<300){
                    msgNotify.success("Customer details updated.")
                    store.dispatch(updateCustomer(customer));
                }else{
                    msgNotify.error("something gone wrong");
                }       
            })
            .catch(err=>{
                    msgNotify.error(err.response.data.details)            
                })
            goBack();
        }   
        
       
        const firstNameChange = (args:SyntheticEvent)=>{
            customer.firstName = (args.target as HTMLInputElement).value;
        }
        const lastNameChange = (args:SyntheticEvent)=>{
            customer.lastName = (args.target as HTMLInputElement).value;
        }
        const emailChange = (args:SyntheticEvent)=>{
            customer.email = (args.target as HTMLInputElement).value;
        }    


    return (
        <div className="customerUpdateCustomer SolidBox">
			<h1 style={{textAlign:"center"}}>Update Customer Details</h1><hr/>
            <form onSubmit={handleSubmit(send)}>
                <TextField name="firstName" label={customer.firstName} variant="outlined" className="TextBox" fullWidth
                {...register("firstName",{
                    required:{
                        value:true,
                        message: 'Missing firstName'
                    }
                })}  onChange={firstNameChange} helperText="First name"/>

                <TextField name="lastName" label={customer.lastName} variant="outlined" className="TextBox" fullWidth
                {...register("lastName",{
                    required:{
                        value:true,
                        message: 'Missing lastName'
                    }
                })}  onChange={lastNameChange} helperText="Last name"/>

                <TextField name="email" label={customer.email} variant="outlined" className="TextBox" fullWidth {...register("email",{
                    required:{
                        value:true,
                        message: 'Missing Email'
                    }
                })}  onChange={emailChange} helperText="Email"/>


                <ButtonGroup variant="contained" fullWidth>
                    <Button type="submit" color="primary" >Update</Button>
                </ButtonGroup>
    
            </form>
            <br/><br/>
            <Button variant="contained" color="error" onClick={goBack}> Back</Button>


        </div>
    );
}

export default CustomerUpdateCustomer;

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {v4 as uuidv4} from 'uuid';

type FormProps = {
    open: boolean,
    updateOpen: any,
    postOrder: any
}

type FormState = {
    id: string,
    type: string,
    customerName: string,
    createdDate: string,
    createdByUsername: string
}

const OrderTypes = [
    {
        value: 'Standard',
        label: 'Standard'
    },
    {
        value: 'SaleOrder',
        label: 'Sale Order'
    },
    {
        value: 'PurchaseOrder',
        label: 'Purchase Order'
    },
    {
        value: 'TransferOrder',
        label: 'Transfer Order'
    },
    {
        value: 'ReturnOrder',
        label: 'Return Order'
    },
];

export default class FormDialog extends React.Component<FormProps, FormState>{

    state : FormState = {
        id:uuidv4(),
        createdDate: "2023-02-17",
        type:"Standard",
        customerName:"Default Customer",
        createdByUsername: "Default User"
    }

    handleClose(save: boolean){
        let order;
        if (save) {
            // call postOrder
            order = {
                id: this.state.id,
                type: this.state.type,
                customerName: this.state.customerName,
                createdDate: this.state.createdDate,
                createdByUsername: this.state.createdByUsername
            }
            this.props.postOrder(order)
        }
        this.props.updateOpen(false);

    };

    render() {
        return (
            <div>
                <Dialog open={this.props.open} onClose={() => this.handleClose(false)}>
                    <DialogTitle>Create a new order.</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the required fields to create a new order.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="id"
                            label="Guid"
                            defaultValue={this.state.id}
                            type="string"
                            fullWidth
                            variant="standard"
                            onChange={e => {
                                this.setState({id: e.target.value})
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="type"
                            select
                            label="Select"
                            defaultValue={this.state.type}
                            variant="standard"
                            onChange={e => {
                                this.setState({type: e.target.value})
                            }}>
                            {OrderTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="customerName"
                            label="Customer Name"
                            defaultValue={this.state.customerName}
                            type="string"
                            fullWidth
                            variant="standard"
                            onChange={e => {
                                this.setState({customerName: e.target.value})
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="createdDate"
                            label="Created Date"
                            type="date"
                            defaultValue={this.state.createdDate}
                            fullWidth
                            variant="standard"
                            onChange={e => {
                                this.setState({createdDate: e.target.value})
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="createdByUsername"
                            label="Created By UserName"
                            defaultValue={this.state.createdByUsername}
                            type="string"
                            fullWidth
                            variant="standard"
                            onChange={e => {
                                this.setState({createdByUsername: e.target.value})
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose(false)}>Cancel</Button>
                        <Button onClick={() => this.handleClose(true)}>Save Order</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
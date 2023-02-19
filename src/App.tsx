import React from 'react';
import './App.css';
import DataTable from "./DataTable";
import Button from '@mui/material/Button';
import FormDialog from "./FormDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Create';
import SearchBar from "material-ui-search-bar";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ResponsiveAppBar from "./ResponsiveAppBar";
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

type AppState = {
    orders: string[]
    selectedGuids: string[]
    createOrderDialog: boolean
    searchValue: string
}

class App extends React.Component<{}, AppState>{
  constructor(props: {}) {
    super(props);
    this.updateSelectedGuids = this.updateSelectedGuids.bind(this);
    this.deleteOrders = this.deleteOrders.bind(this);
    this.updateCreateOrderDialog = this.updateCreateOrderDialog.bind(this);
    this.postOrder = this.postOrder.bind(this);
  }

  state: AppState = {
        orders: [],
        selectedGuids: [],
        createOrderDialog: false,
        searchValue: ""
  }

  theme = createTheme({
        palette: {
            primary: {
                main: red[500],
            }
        }
  })

  componentDidMount() {
    this.getOrders()
  }

  updateSelectedGuids(newSelectionModel: any) {
      console.log(newSelectionModel);
      this.setState({selectedGuids: newSelectionModel});
  }

  updateCreateOrderDialog(isOpen:boolean) {
      this.setState({createOrderDialog: isOpen});
  }

  async getOrders() {
      fetch('https://brummordersapi.azurewebsites.net/Orders')
          .then(response => response.json())
          .then(data => this.setState({ orders: data }))
          .catch(error => console.error(error));
  }

  postOrder(order:any) {
      fetch('https://brummordersapi.azurewebsites.net/Orders', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*'
          },
          body: JSON.stringify(order)
      })
          .then(response => {
              if (response.ok) {
                  // Make a GET request to fetch new data after successful POST
                  return this.getOrders();
              } else {
                  throw new Error('Failed to create new data');
              }
          });
  }

  deleteOrders(guidList:string[]) {
      guidList.forEach(guid =>
          fetch(`https://brummordersapi.azurewebsites.net/Orders/${guid}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          }).then(response => {
              if (response.ok) {
                  // Make a GET request to fetch new data after successful POST
                  return this.getOrders();
              } else {
                  throw new Error('Failed to create new data');
              }
          }));
  }

  getFilteredOrderType(orderType:string) {
    if(orderType === "") {
        // do a regular GET since we want all types
        this.getOrders();
    } else {
        // GET the specified order type
        fetch(`https://brummordersapi.azurewebsites.net/Orders/FilterByType/${orderType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        }).then(response => response.json())
            .then(data => this.setState({ orders: data }))
            .catch(error => console.error(error));
    }
  }

    render() {
    return (
        <ThemeProvider theme={this.theme}>
        <div className="App">
            <div>
                <ResponsiveAppBar></ResponsiveAppBar>
            </div>
            <div className="header-components">
                <SearchBar style={{width:window.innerWidth * 0.3, marginRight: '20px', marginLeft: '5px', height:45}}
                           onChange={(e) => this.setState({searchValue:e})}
                           onCancelSearch={() => this.setState({searchValue:""})}/>
                <Button variant="outlined" sx={{m:1,height:45}} onClick={() => this.setState({createOrderDialog:true})}
                        startIcon={<AddIcon />} >Create Order</Button>
                <Button variant="outlined" sx={{m:1, height:45}} onClick={() => this.deleteOrders(this.state.selectedGuids)}
                        startIcon={<DeleteIcon />}>Delete Order(s)</Button>
                <FormControl sx={{ m: 1, minWidth: 130}} color="primary">
                    <InputLabel>Order Type</InputLabel>
                    <Select
                        variant="outlined"
                        autoWidth
                        label="Order Type"
                        style={{ height:45}}
                        onChange={(e:SelectChangeEvent) => this.getFilteredOrderType(e.target.value)}>
                        <MenuItem value={""}>All Types</MenuItem>
                        <MenuItem value={"Standard"}>Standard</MenuItem>
                        <MenuItem value={"SaleOrder"}>Sale Order</MenuItem>
                        <MenuItem value={"PurchaseOrder"}>Purchase Order</MenuItem>
                        <MenuItem value={"TransferOrder"}>Transfer Order</MenuItem>
                        <MenuItem value={"ReturnOrder"}>Return Order</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormDialog postOrder={this.postOrder} updateOpen={this.updateCreateOrderDialog} open={this.state.createOrderDialog}></FormDialog>
            </div>
          <div>
            <DataTable orders={this.state.orders} setSelectionModel={this.updateSelectedGuids} searchValue={this.state.searchValue}></DataTable>
          </div>
        </div>
        </ThemeProvider>
    );
  }
}

export default App;

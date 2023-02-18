import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

type DataTableProps = {
    orders: string[]
    setSelectionModel:any
    searchValue: string
}

class DataTable extends React.Component<DataTableProps, {}>{

    columns: GridColDef[] = [
    { field: 'id', headerName: 'Guid', width: window.innerHeight * 0.4 },
    { field: 'type', headerName: 'Order Type', width: window.innerHeight * 0.15 },
    { field: 'customerName', headerName: 'Customer Name', width: window.innerHeight * 0.2 },
    { field: 'createdDate', headerName: 'Created Date', type: 'Date', width: window.innerHeight * 0.2 },
    { field: 'createdByUsername', headerName: 'Created by UserName', width: window.innerHeight * 0.2 }
];

    render() {
        return (
            <div style={{height: window.innerHeight - (window.innerHeight * 0.15), width: '100%'}}>
                <DataGrid
                    rows={this.props.orders}
                    columns={this.columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    getRowId={(row) => row.id}
                    onSelectionModelChange={(newSelectionModel) => {
                        this.props.setSelectionModel(newSelectionModel);
                    }}
                    filterModel={this.props.searchValue !== "" ? {
                        items: [{ columnField: 'id', operatorValue: 'contains', value: this.props.searchValue }],
                    } : {items: []}}
                />
            </div>
        );
    }
} export default DataTable

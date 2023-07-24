import React, { useEffect, useState } from "react";
import DataList from "./DataList";
import Form from "./Form";

const Data = () => {
  const [data, setdata] = useState([]);
  const[searchData, setsearchData] =useState('')

  const handlesearch =(e) => {
    setsearchData(e.target.value)
  }
  //filter out data based on the search input
    const filterdata = data.filter((item) =>
    item.date.includes(searchData) ||
    item.description.includes(searchData) ||
    item.category.includes(searchData) ||
    item.amount.toString().includes(searchData)
    );
  //fetch data

  const fetchData = () => {
    fetch("http://localhost:3000/transactions")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        //update the data
        setdata(data);
      });
  }

  const updateui =(tran) => {
    setdata([tran, ...data]);
   
  }

  useEffect(() => {
    fetchData()
  }, []);

  // handle delete
  const [transactions, setTransactions] = useState([]);

   const handleDelete = (id) => {
    fetch(`http://localhost:3000/transactions/${id}`,{
    method:'DELETE'
    })
    .then(res => {
        if(!res.ok){
            throw new Error('Error')
        }
        return res.json()
    })
    .then ((data) => {
        console.log(data)

        //remove the data by its id
         const updateremoved = transactions.filter((transaction) => transaction.id !==id);
          setTransactions(updateremoved);
          fetchData()
          alert('Transaction deleted')

    })
    .catch(error => console.log('Failed',error))

   }
  return (
    <div>
      <Form handleui={updateui}/>
      <div className="search">
        <input type="text" placeholder="search..." onChange={handlesearch}/>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <DataList data={filterdata} Deleting={handleDelete}/>
      </table>
    </div>
  );
};

export default Data;

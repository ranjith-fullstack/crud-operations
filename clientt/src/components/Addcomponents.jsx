import React, { useState, useEffect } from "react";
import axios from "axios";
import './addcomponents.css'

export const Addcomponents = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    sno: "",
    customername: "",
    shippingorder: "",
    carrier: "",
    tracking: "",
  });
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [editItem, setEditItem] = useState({
    sno: "",
    customername: "",
    shippingorder: "",
    carrier: "",
    tracking: "",
  });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value,
    });
  };

  const handleAddItem = async () => {
    if (
      !newItem.sno ||
      !newItem.customername ||
      !newItem.shippingorder ||
      !newItem.carrier ||
      !newItem.tracking
    ) {
      alert("Please fill all input fields.");
      return;
    }
  
    try {
      await axios.post("http://localhost:4000/items", newItem);
      setItems([...items, newItem]);
      setNewItem({
        sno: "",
        customername: "",
        shippingorder: "",
        carrier: "",
        tracking: "",
      });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };
  

  const handleEditClick = (index) => {
    const itemToEdit = items[index];
    setEditItem(itemToEdit);
    setEditItemIndex(index);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:4000/items/${editItem.sno}`, editItem);
      const updatedItems = [...items];
      updatedItems[editItemIndex] = editItem;
      setItems(updatedItems);
      setEditItemIndex(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      const itemToDelete = items[index];
      await axios.delete(`http://localhost:4000/items/${itemToDelete.sno}`);
      const updatedItems = items.filter((item, i) => i !== index);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleViewItem = (index) => {
    setSelectedItem(items[index]);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };
  const handleDownload = async () => {
    try {
      window.open('http://localhost:4000/download', '_blank');
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        name="sno"
        value={newItem.sno}
        onChange={handleInputChange}
        placeholder="S.No"
      />
      <input
        type="text"
        name="customername"
        value={newItem.customername}
        onChange={handleInputChange}
        placeholder="Customer Name"
      />
      <input
        type="text"
        name="shippingorder"
        value={newItem.shippingorder}
        onChange={handleInputChange}
        placeholder="Shipping Order"
      />
      <input
        type="text"
        name="carrier"
        value={newItem.carrier}
        onChange={handleInputChange}
        placeholder="Carrier"
      />
      <input
        type="text"
        name="tracking"
        value={newItem.tracking}
        onChange={handleInputChange}
        placeholder="Tracking"
      />
      <button onClick={handleAddItem}>Add</button>
      <button onClick={handleDownload}>download</button>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Shipping Order</th>
            <th>Carrier</th>
            <th>Tracking</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.sno}</td>
              <td>{item.customername}</td>
              <td>{item.shippingorder}</td>
              <td>{item.carrier}</td>
              <td>{item.tracking}</td>
              <td>
                <button onClick={() => handleEditClick(index)}>Edit</button>
                <button onClick={() => handleDeleteItem(index)}>Delete</button>
                <button onClick={() => handleViewItem(index)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedItem && (
  <div className="popup">
    <div className="popup-content">
      <span><strong>S.No:</strong> {selectedItem.sno}</span>
      <span><strong>Customer Name:</strong> {selectedItem.customername}</span>
      <span><strong>Shipping Order:</strong> {selectedItem.shippingorder}</span>
      <span><strong>Carrier:</strong> {selectedItem.carrier}</span>
      <span><strong>Tracking:</strong> {selectedItem.tracking}</span>
      <button onClick={closePopup}>Close</button>
    </div>
  </div>
)}

      {editItemIndex !== null && (
        <div className="edit-popup">
          <input
            type="text"
            name="customername"
            value={editItem.customername}
            onChange={(e) => setEditItem({ ...editItem, customername: e.target.value })}
            placeholder="Customer Name"
          />
          <input
            type="text"
            name="shippingorder"
            value={editItem.shippingorder}
            onChange={(e) => setEditItem({ ...editItem, shippingorder: e.target.value })}
            placeholder="Shipping Order"
          />
          <input
            type="text"
            name="carrier"
            value={editItem.carrier}
            onChange={(e) => setEditItem({ ...editItem, carrier: e.target.value })}
            placeholder="Carrier"
          />
          <input
            type="text"
            name="tracking"
            value={editItem.tracking}
            onChange={(e) => setEditItem({ ...editItem, tracking: e.target.value })}
            placeholder="Tracking"
          />
          <button onClick={handleSaveEdit}>Save</button>
        </div>
      )}
    </div>
  );
};

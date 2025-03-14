import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Container, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const ManageQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [deleteId, setDeleteId] = useState(null); // Store question ID for deletion
  const [openDialog, setOpenDialog] = useState(false); // Control dialog visibility

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    axios
      .get("http://localhost:8000/get-questions")
      .then((response) => setQuestions(response.data))
      .catch((error) => console.error("Error fetching questions:", error));
  };

  const handleDelete = () => {
    if (deleteId) {
      axios
        .delete(`http://localhost:8000/question/delete/${deleteId}/`)
        .then(() => {
          setQuestions((prevQuestions) => prevQuestions.filter((q) => q.question_id !== deleteId));
          setOpenDialog(false); // Close the dialog after successful deletion
        })
        .catch((error) => console.error("Error deleting question:", error));
    }
  };

  const handleOpenDialog = (questionId) => {
    setDeleteId(questionId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setDeleteId(null);
    setOpenDialog(false);
  };

  const rows = questions.map((q) => ({
    id: q.question_id,
    text: q.question_text,
    marks: q.marks,
    course: q.course,
    co: q.co_label,
  }));

  const columns = [
    { field: "id", headerName: "ID", flex: 0.1 },
    { field: "text", headerName: "Question", flex: 0.5 },
    { field: "marks", headerName: "Marks", flex: 0.1 },
    { field: "course", headerName: "Course", flex: 0.4 },
    { field: "co", headerName: "CO", flex: 0.1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to={`/edit-question/${params.row.id}`}>
            <IconButton color="primary" size="small" sx={{ marginRight: 1 }}>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton color="error" size="small" onClick={() => handleOpenDialog(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Container sx={{ marginTop: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h2>Manage Questions</h2>
        <Link to="/add-question">
          <Button variant="contained" color="success">
            Add New Question
          </Button>
        </Link>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[8, 16, 24]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this question?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageQuestion;

<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-title class="d-flex justify-center align-center">
      Панель администратора
    </v-card-title>
    <v-container class="d-flex justify-center align-center">
      <v-row class="d-flex flex-column align-center">
        <v-file-input
          label="Upload your files"
          multiple
          v-model="files"
          accept=".xlsx, .xls"
          width="300px"
        >
        </v-file-input>
        <v-btn
          color="primary"
          class="mb-2"
          @click="handleFileUpload()"
          width="300"
          disabled
        >
          Восстановить базу
        </v-btn>
        <v-btn
          color="primary"
          class="mb-2"
          @click="exportToExcel()"
          width="300"
        >
          Скачать базу
        </v-btn>
        <v-btn disabled color="primary" class="mb-2" to="/" width="300">
          Редактировать пользователей
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import * as XLSX from "xlsx";

export default {
  name: "HomeView",
  data() {
    return {
      files: [],
    };
  },
  computed: {
  
  },
  methods: {
    ...mapActions({
      getDatabase: "excel_controller/getDatabase",
      postDatabase: "excel_controller/postDatabase",
    }),
    
    database() {
      return this.$store.state.excel_controller.database;
    },
    

    exportToExcel() {
      const workbook = XLSX.utils.book_new();

      // Assuming this.Database is an array of objects with table_name and table_data
      this.database().forEach((table) => {
        const table_name = table.table_name; // Get the table name
        const worksheet = XLSX.utils.json_to_sheet(table.table_data); // Convert table data to a worksheet
        XLSX.utils.book_append_sheet(workbook, worksheet, table_name); // Append the worksheet with the table name
      });

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      this.saveAsExcelFile(
        excelBuffer,
        `database_dump ${new Date().toLocaleString()}`
      );
    },
    saveAsExcelFile(buffer, fileName) {
      const data = new Blob([buffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName + ".xlsx");
      link.click();
      window.URL.revokeObjectURL(url);
    },

    handleFileUpload() {
      if (this.files.length === 0) {
        alert("Please select a file to upload.");
        return;
      }

      const filePromises = this.files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: "array" });

              const parsedData = [];

              workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Assuming the first row contains headers
                const headers = json[0];
                const tableData = json.slice(1).map((row) => {
                  const rowData = {};
                  headers.forEach((header, index) => {
                    rowData[header] = row[index]; // Map header to row data
                  });
                  return rowData;
                });

                parsedData.push({
                  table_name: sheetName,
                  table_data: tableData,
                });
              });

              resolve(parsedData);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsArrayBuffer(file);
        });
      });

      Promise.all(filePromises)
        .then(async (allParsedData) => {
          // Flatten the array of arrays
          const combinedData = allParsedData.flat();
          await this.postDatabase(combinedData);
          alert("Finished.");
          this.files = []; // Clear the files after processing
        })
        .catch((error) => {
          console.error("Error reading files:", error);
          alert("An error occurred while reading the files.");
        });
    },
  },

  async created() {
    await this.getDatabase();
  },
};
</script>

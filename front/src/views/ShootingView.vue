<template>
    <div>
      <p>Scanned Barcode Data: {{ barcodeData }}</p>
      <button @click="startScanning" v-if="!isScanning">Start Scanning</button>
      <button @click="stopScanning" v-if="isScanning">Stop Scanning</button>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        barcodeData: "",
        buffer: "",
        scanTimeout: null,
        isScanning: false, // Track whether scanning is active
      };
    },
    methods: {
      startScanning() {
        this.isScanning = true;
        // Add keypress listener
        window.addEventListener('keypress', this.handleKeypress);
      },
      stopScanning() {
        this.isScanning = false;
        // Clean up listener
        window.removeEventListener('keypress', this.handleKeypress);
        this.buffer = ""; // Reset buffer when stopping
      },
      handleKeypress(event) {
        if (!this.isScanning) return; // Ignore keypresses when not scanning
  
        if (event.key === 'Enter') {
          this.barcodeData = this.buffer; // Assign buffer to barcodeData
          this.buffer = ""; // Reset the buffer
          this.processBarcode();
        //   this.stopScanning(); // Stop scanning after ENTER key
          return;
        }
  
        if (this.scanTimeout) clearTimeout(this.scanTimeout);
  
        this.buffer += event.key;
  
        // Set a timeout to decide when the barcode scan ends
        this.scanTimeout = setTimeout(() => {
          this.barcodeData = this.buffer;
          this.buffer = ""; // Reset the buffer
          this.processBarcode();
        }, 300); // Adjust timeout depending on the expected speed of input
      },
      processBarcode() {
        console.log("Barcode data received:", this.barcodeData);
        // Process barcode data here
      }
    },
    beforeDestroy() {
      // Clean up listener when the component is destroyed
      window.removeEventListener('keypress', this.handleKeypress);
    }
  };
</script>
  
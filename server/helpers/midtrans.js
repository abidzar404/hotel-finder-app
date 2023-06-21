const midtransClient = require("midtrans-client");
// Create Snap API instance
let snap = new midtransClient.Snap({
   isProduction: false,
   clientKey: "SB-Mid-client-4DSlR2lTUTCm8kID",
   serverKey: "SB-Mid-server-E_k_U1xor_ZE7soOGKYAvcpG",
});

module.exports = snap;

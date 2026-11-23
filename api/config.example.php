<?php
// Copy this file to api/config.php on Hostinger (never commit real secrets to Git).
return [
  'db_host' => 'localhost',
  'db_name' => 'u000000000_nursingug',
  'db_user' => 'u000000000_admin',
  'db_pass' => 'CHANGE_ME_STRONG_PASSWORD',

  // PayPal REST API Credentials (from developer.paypal.com)
  'paypal_mode' => 'sandbox', // change to 'live' when launching live payments
  'paypal_client_id' => 'YOUR_PAYPAL_CLIENT_ID',
  'paypal_secret' => 'YOUR_PAYPAL_SECRET',
];

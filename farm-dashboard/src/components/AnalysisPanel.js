import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const AnalysisPanel = ({ moisture, temperature, humidity }) => {

  const healthScore = Math.floor((moisture/10 + temperature + humidity)/3);

  return (
    <div style={{width:"300px"}}>

      <Card style={{marginBottom:"20px"}}>
        <CardContent>

          <Typography variant="h6">
            Soil Health
          </Typography>

          <Typography variant="h3">
            {healthScore}%
          </Typography>

          <Typography>
            Condition: Good
          </Typography>

        </CardContent>
      </Card>


      <Card>
        <CardContent>

          <Typography variant="h6">
            Crop Recommendation
          </Typography>

          <Typography>✓ Wheat</Typography>
          <Typography>✓ Rice</Typography>
          <Typography>✓ Maize</Typography>

          <Typography style={{marginTop:10}}>
            Avoid:
          </Typography>

          <Typography>✗ Cotton</Typography>

        </CardContent>
      </Card>

    </div>
  );
};

export default AnalysisPanel;
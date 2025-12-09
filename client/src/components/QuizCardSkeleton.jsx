import React from "react";
import { Card, CardContent, CardActions, Skeleton, Stack } from "@mui/material";

const QuizCardSkeleton = () => {
  return (
    <Card
      sx={{
        mb: 2.5,
        borderRadius: 3,
        background: "rgba(255,255,255,0.9)",
      }}
    >
      <CardContent sx={{ pb: 1.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >

          <Skeleton variant="text" width="40%" height={28} />

          <Skeleton variant="rounded" width={70} height={24} />
        </Stack>


        <Skeleton
          variant="text"
          width="70%"
          height={18}
          sx={{ mt: 1.2 }}
        />
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.2, pt: 0 }}>

        <Skeleton variant="rounded" width={110} height={34} />
      </CardActions>
    </Card>
  );
};

export default QuizCardSkeleton;

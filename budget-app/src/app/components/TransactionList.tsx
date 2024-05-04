"use client";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import dayjs from "dayjs";
import { ListItemButton } from "@mui/material";
import numbro from "numbro";
import { useRouter } from "next/navigation";
import { formatNumberThousand } from "@/global/formatNumberThousand";

/**
 * Hotfix for uuid gen
 * @param length
 * @returns
 */
function generateRandomString(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export interface TransactionListProps {
  data: {
    id?: string;
    category?: string;
    date?: Date;
    amount?: number;
    payee?: string;
    account?: string;
    memo?: string;
  }[];
  /**
   * Optional onClickAction, default to redirect to /transaction/edit/:id
   * @param id 
   * @returns 
   */
  onClickAction?: (id?: string) => void;
}

export function TransactionList(props: TransactionListProps) {
  const router = useRouter();
  const handleListClick = (item: TransactionListProps["data"][number]) => {
    if (props.onClickAction) {
      props.onClickAction(item.id);
      return;
    }
    console.log(`Redirecting to /transaction/edit/${item.id}`);
    router.push(`/transaction/edit/${item.id}`);
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {props.data.map((item) => (
        <React.Fragment key={item.id ?? generateRandomString(8)}>
          <ListItem
            dense={true}
            alignItems="flex-start"
            sx={{
              padding: "0px",
              // paddingTop: "0px",
              // paddingBottom: "0px",
            }}
          >
            <ListItemButton
              role={undefined}
              onClick={() => handleListClick(item)}
              sx={{
                paddingLeft: "40px",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              {/* <ListItemAvatar>
              <Avatar>
                {item.category
                  ? item.category?.slice(0, 2)
                  : item.payee?.slice(0, 2)}
              </Avatar>
            </ListItemAvatar> */}

              <ListItemText
                primary={
                  item.category || item.category !== ""
                    ? item.category
                    : "No Category"
                }
                secondary={
                  <React.Fragment>
                    {/* <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    > */}
                    {item.payee}
                    {/* </Typography> */}
                    {` — ${formatNumberThousand(item.amount)} on ${dayjs(
                      item.date
                    ).format("MMM DD")}`}
                    {dayjs().year().toString() !==
                    dayjs(item.date).year().toString()
                      ? `, ${dayjs(item.date).year()}`
                      : ""}
                  </React.Fragment>
                }
              />
            </ListItemButton>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}

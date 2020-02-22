
export class ConversationModel {
    public participants ?: string[];
    public messages     ?: {
                            sender  ?: string;
                            message ?: string;
                            time    ?: number;
                            dispName?: string;
                            }[];
    public otherUser    ?: string;
    public title        ?: string;
    public _id          ?: {
                     $oid  ?: string;
                         };
}


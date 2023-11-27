export const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case "online":
            return "green.500";
        case "away":
            return "yellow.500";
        case "busy":
            return "red.500";
        case "in meeting":
            return "blue.500";
        case "offline":
            return "gray.500";
        default:
            return "gray.500";
    }
};
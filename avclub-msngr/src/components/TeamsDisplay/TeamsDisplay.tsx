import { TeamsDisplayProps } from "../../types/types"
import { Text, Stack, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export const TeamsDisplay = ({ teams }: TeamsDisplayProps) => {

        return (
            <>
                {teams.map((team) => (
                    <Stack direction="column" key={team.teamId}>
                        <Link as={NavLink} to={team.teamId} _activeLink={{color: "brand.accent"}}>
                            <Text fontWeight={600}>{team.name}</Text>
                        </Link>
                    </Stack>
                ))}
            </>
        )
}
import React from "react";
import {
  ErrorContainer,
  ContentWrapper,
  IconContainer,
  TextContent,
  Title,
  Message,
} from "./ErrorContent.styles";
import { HmuButton } from "../../../../shared/components";

interface ErrorContentProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick: () => void;
  colorType?: "primary" | "error" | "warning";
}

const ErrorContent: React.FC<ErrorContentProps> = ({
  icon,
  title,
  message,
  buttonText = "Return to Dashboard",
  onButtonClick,
  colorType = "primary",
}) => {
  return (
    <ErrorContainer>
      <ContentWrapper>
        <IconContainer colorType={colorType}>{icon}</IconContainer>

        <TextContent>
          <Title variant="h4">{title}</Title>
          <Message variant="body1">{message}</Message>
        </TextContent>

        <HmuButton
          label={buttonText}
          onClick={onButtonClick}
          variant="primary"
          sx={{ minWidth: 160 }}
        />
      </ContentWrapper>
    </ErrorContainer>
  );
};

export default ErrorContent;

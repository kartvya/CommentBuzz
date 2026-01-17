/**
 * Dependency Injection Container Setup
 * Configures and registers all dependencies using tsyringe
 */

import "reflect-metadata";
import { container } from "tsyringe";

// Storage
import { ITokenStorage } from "../storage/ITokenStorage";
import { TokenStorage } from "../storage/tokenStorage";

// API Client
import { IApiClient } from "../api/IApiClient";
import { RtkQueryApiClient } from "../api/RtkQueryApiClient";

// Repository Interfaces
import { IAuthRepository } from "../../modules/auth/domain/auth.repository";
import { IPostRepository } from "../../modules/post/domain/post.repository";
import { ICommentRepository } from "../../modules/comment/domain/comment.repository";
import { IProfileRepository } from "../../modules/profile/domain/profile.repository";

// Repository Implementations
import { AuthRepositoryImpl } from "../../modules/auth/data/auth.repository.impl";
import { PostRepositoryImpl } from "../../modules/post/data/post.repository.impl";
import { CommentRepositoryImpl } from "../../modules/comment/data/comment.repository.impl";
import { ProfileRepositoryImpl } from "../../modules/profile/data/profile.repository.impl";

// Auth Use Cases
import { LoginUseCase } from "../../modules/auth/domain/usecases/login.usecase";
import { SignupUseCase } from "../../modules/auth/domain/usecases/signup.usecase";
import { LogoutUseCase } from "../../modules/auth/domain/usecases/logout.usecase";
import { RefreshTokenUseCase } from "../../modules/auth/domain/usecases/refresh.usecase";

// Post Use Cases
import { CreatePostUseCase } from "../../modules/post/domain/usecases/createPost.usecase";
import { GetPostsUseCase } from "../../modules/post/domain/usecases/getPosts.usecase";
import { GetPostByIdUseCase } from "../../modules/post/domain/usecases/getPostById.usecase";
import { ToggleVoteUseCase } from "../../modules/post/domain/usecases/toggleVote.usecase";
import { DeletePostUseCase } from "../../modules/post/domain/usecases/deletePost.usecase";
import { GetOnlyUserPostUseCase } from "../../modules/post/domain/usecases/getOnlyUserPost.usecase";

// Comment Use Cases
import { CreateCommentUseCase } from "../../modules/comment/domain/usecases/createComment.usecase";
import { GetCommentsUseCase } from "../../modules/comment/domain/usecases/getComments.usecase";
import { DeleteCommentUseCase } from "../../modules/comment/domain/usecases/deleteComment.usecase";
import { ToggleCommentVoteUseCase } from "../../modules/comment/domain/usecases/toggleVote.usecase";
import { GetOnlyUserCommentsUseCase } from "../../modules/comment/domain/usecases/getOnlyUserComments.usecase";

// Profile Use Cases
import { GetProfileUseCase } from "../../modules/profile/domain/usecases/getProfile.usecase";
import { EditProfileUseCase } from "../../modules/profile/domain/usecases/editProfile.usecase";
import { TrackSessionTimeUseCase } from "../../modules/profile/domain/usecases/trackSessionTime.usecase";
import { GetWeeklyAverageTimeUseCase } from "../../modules/profile/domain/usecases/getWeeklyAverageTime.usecase";

// Dependency tokens
export const TOKENS = {
  IApiClient: "IApiClient",
  ITokenStorage: "ITokenStorage",
  IAuthRepository: "IAuthRepository",
  IPostRepository: "IPostRepository",
  ICommentRepository: "ICommentRepository",
  IProfileRepository: "IProfileRepository",
  LoginUseCase: "LoginUseCase",
  SignupUseCase: "SignupUseCase",
  LogoutUseCase: "LogoutUseCase",
  RefreshTokenUseCase: "RefreshTokenUseCase",
  CreatePostUseCase: "CreatePostUseCase",
  GetPostsUseCase: "GetPostsUseCase",
  GetPostByIdUseCase: "GetPostByIdUseCase",
  ToggleVoteUseCase: "ToggleVoteUseCase",
  DeletePostUseCase: "DeletePostUseCase",
  GetOnlyUserPostUseCase: "GetOnlyUserPostUseCase",
  CreateCommentUseCase: "CreateCommentUseCase",
  GetCommentsUseCase: "GetCommentsUseCase",
  DeleteCommentUseCase: "DeleteCommentUseCase",
  ToggleCommentVoteUseCase: "ToggleCommentVoteUseCase",
  GetOnlyUserCommentsUseCase: "GetOnlyUserCommentsUseCase",
  GetProfileUseCase: "GetProfileUseCase",
  EditProfileUseCase: "EditProfileUseCase",
  TrackSessionTimeUseCase: "TrackSessionTimeUseCase",
  GetWeeklyAverageTimeUseCase: "GetWeeklyAverageTimeUseCase",
} as const;

/**
 * Initialize and configure the DI container
 * Registers all dependencies with their implementations
 */
export function setupContainer(): void {
  // Create singleton instances
  const apiClientInstance = new RtkQueryApiClient();
  const tokenStorageInstance = new TokenStorage();

  // Register API Client (singleton) - using registerInstance to ensure proper type resolution
  container.registerInstance<IApiClient>(TOKENS.IApiClient, apiClientInstance);

  // Register Storage (singleton) - using registerInstance to ensure proper type resolution
  container.registerInstance<ITokenStorage>(
    TOKENS.ITokenStorage,
    tokenStorageInstance
  );

  // Register Repositories with dependencies
  container.register<IAuthRepository>(TOKENS.IAuthRepository, {
    useFactory: (c) => {
      const apiClient = c.resolve<IApiClient>(TOKENS.IApiClient);
      const tokenStorage = c.resolve<ITokenStorage>(TOKENS.ITokenStorage);
      return new AuthRepositoryImpl(apiClient, tokenStorage);
    },
  });

  container.register<IPostRepository>(TOKENS.IPostRepository, {
    useFactory: (c) => {
      const apiClient = c.resolve<IApiClient>(TOKENS.IApiClient);
      return new PostRepositoryImpl(apiClient);
    },
  });

  container.register<ICommentRepository>(TOKENS.ICommentRepository, {
    useFactory: (c) => {
      const apiClient = c.resolve<IApiClient>(TOKENS.IApiClient);
      return new CommentRepositoryImpl(apiClient);
    },
  });

  container.register<IProfileRepository>(TOKENS.IProfileRepository, {
    useFactory: (c) => {
      const apiClient = c.resolve<IApiClient>(TOKENS.IApiClient);
      return new ProfileRepositoryImpl(apiClient);
    },
  });

  // Register Auth Use Cases
  container.register<LoginUseCase>(TOKENS.LoginUseCase, {
    useFactory: (c) => {
      const authRepository = c.resolve<IAuthRepository>(TOKENS.IAuthRepository);
      return new LoginUseCase(authRepository);
    },
  });

  container.register<SignupUseCase>(TOKENS.SignupUseCase, {
    useFactory: (c) => {
      const authRepository = c.resolve<IAuthRepository>(TOKENS.IAuthRepository);
      return new SignupUseCase(authRepository);
    },
  });

  container.register<LogoutUseCase>(TOKENS.LogoutUseCase, {
    useFactory: (c) => {
      const authRepository = c.resolve<IAuthRepository>(TOKENS.IAuthRepository);
      return new LogoutUseCase(authRepository);
    },
  });

  container.register<RefreshTokenUseCase>(TOKENS.RefreshTokenUseCase, {
    useFactory: (c) => {
      const authRepository = c.resolve<IAuthRepository>(TOKENS.IAuthRepository);
      return new RefreshTokenUseCase(authRepository);
    },
  });

  // Register Post Use Cases
  container.register<CreatePostUseCase>(TOKENS.CreatePostUseCase, {
    useFactory: (c) => {
      const postRepository = c.resolve<IPostRepository>(TOKENS.IPostRepository);
      return new CreatePostUseCase(postRepository);
    },
  });

  container.register<GetPostsUseCase>(TOKENS.GetPostsUseCase, {
    useFactory: (c) => {
      const postRepository = c.resolve<IPostRepository>(TOKENS.IPostRepository);
      return new GetPostsUseCase(postRepository);
    },
  });

  container.register<GetPostByIdUseCase>(TOKENS.GetPostByIdUseCase, {
    useFactory: (c) => {
      const postRepository = c.resolve<IPostRepository>(TOKENS.IPostRepository);
      return new GetPostByIdUseCase(postRepository);
    },
  });

  container.register<ToggleVoteUseCase>(TOKENS.ToggleVoteUseCase, {
    useFactory: (c) => {
      const postRepository = c.resolve<IPostRepository>(TOKENS.IPostRepository);
      return new ToggleVoteUseCase(postRepository);
    },
  });

  container.register<DeletePostUseCase>(TOKENS.DeletePostUseCase, {
    useFactory: (c) => {
      const postRepository = c.resolve<IPostRepository>(TOKENS.IPostRepository);
      return new DeletePostUseCase(postRepository);
    },
  });

  container.register<GetOnlyUserPostUseCase>(TOKENS.GetOnlyUserPostUseCase, {
    useFactory: (c) => {
      const postRepository = c.resolve<IPostRepository>(TOKENS.IPostRepository);
      return new GetOnlyUserPostUseCase(postRepository);
    },
  });

  // Register Comment Use Cases
  container.register<CreateCommentUseCase>(TOKENS.CreateCommentUseCase, {
    useFactory: (c) => {
      const commentRepository = c.resolve<ICommentRepository>(
        TOKENS.ICommentRepository
      );
      return new CreateCommentUseCase(commentRepository);
    },
  });

  container.register<GetCommentsUseCase>(TOKENS.GetCommentsUseCase, {
    useFactory: (c) => {
      const commentRepository = c.resolve<ICommentRepository>(
        TOKENS.ICommentRepository
      );
      return new GetCommentsUseCase(commentRepository);
    },
  });

  container.register<DeleteCommentUseCase>(TOKENS.DeleteCommentUseCase, {
    useFactory: (c) => {
      const commentRepository = c.resolve<ICommentRepository>(
        TOKENS.ICommentRepository
      );
      return new DeleteCommentUseCase(commentRepository);
    },
  });

  container.register<ToggleCommentVoteUseCase>(
    TOKENS.ToggleCommentVoteUseCase,
    {
      useFactory: (c) => {
        const commentRepository = c.resolve<ICommentRepository>(
          TOKENS.ICommentRepository
        );
        return new ToggleCommentVoteUseCase(commentRepository);
      },
    }
  );

  container.register<GetOnlyUserCommentsUseCase>(
    TOKENS.GetOnlyUserCommentsUseCase,
    {
      useFactory: (c) => {
        const commentRepository = c.resolve<ICommentRepository>(
          TOKENS.ICommentRepository
        );
        return new GetOnlyUserCommentsUseCase(commentRepository);
      },
    }
  );

  // Register Profile Use Cases
  container.register<GetProfileUseCase>(TOKENS.GetProfileUseCase, {
    useFactory: (c) => {
      const profileRepository = c.resolve<IProfileRepository>(
        TOKENS.IProfileRepository
      );
      return new GetProfileUseCase(profileRepository);
    },
  });

  container.register<EditProfileUseCase>(TOKENS.EditProfileUseCase, {
    useFactory: (c) => {
      const profileRepository = c.resolve<IProfileRepository>(
        TOKENS.IProfileRepository
      );
      return new EditProfileUseCase(profileRepository);
    },
  });

  container.register<TrackSessionTimeUseCase>(TOKENS.TrackSessionTimeUseCase, {
    useFactory: (c) => {
      const profileRepository = c.resolve<IProfileRepository>(
        TOKENS.IProfileRepository
      );
      return new TrackSessionTimeUseCase(profileRepository);
    },
  });

  container.register<GetWeeklyAverageTimeUseCase>(
    TOKENS.GetWeeklyAverageTimeUseCase,
    {
      useFactory: (c) => {
        const profileRepository = c.resolve<IProfileRepository>(
          TOKENS.IProfileRepository
        );
        return new GetWeeklyAverageTimeUseCase(profileRepository);
      },
    }
  );
}

/**
 * Get the configured container instance
 * Call setupContainer() first before using this
 */
export function getContainer() {
  return container;
}
